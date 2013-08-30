<?php

// src/Sdz/BlogBundle/Controller/BlogController.php
namespace RSHub\MarketplaceBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RSHub\MarketplaceBundle\Entity\Modification;
use RSHub\MarketplaceBundle\Form\ModificationType;
use RSHub\MarketplaceBundle\Entity\Category;

class MarketplaceController extends Controller {
	public function indexAction() {
		/*return $this->render(
						'RSHubMarketplaceBundle:Marketplace:index.html.twig',
						array('tag' => '',
								'categories' => $this->getDoctrine()
										->getRepository(
												'RSHubMarketplaceBundle:Category')
										->findAll(),
								'mods' => $this->getDoctrine()
										->getRepository(
												'RSHubMarketplaceBundle:Modification')
										->findAll()));*/
		return $this->tagAction('all', 'newest');

	}
	public function tagAction($tag, $sort) {

		$rep = $this->getDoctrine()
				->getRepository('RSHubMarketplaceBundle:Modification');
		$tag_list = $this->getDoctrine()
				->getRepository('RSHubMarketplaceBundle:Category')
				->findAll();
		$src_tags = array();
		if ($tag == 'all') {
			$sl_tags = $tag_list;
			$str_tagl = array();
			foreach ($tag_list as $ct) {
				$str_tagl[] = $ct->getName();
			}
			$src_tags = $str_tagl;
		} else {
			$tago = $this->getDoctrine()
					->getRepository('RSHubMarketplaceBundle:Category')
					->findBy(array('name' => $tag))[0];
			$sl_tags = array($tago->getName());
			$src_tags = $sl_tags;
			$tag = $tago;
		}
		switch ($sort) {
		case 'popularity':
			$mods = $rep->getByPopularity($src_tags);
			break;
		case 'downloads':
			$mods = $rep->getByDownloads($src_tags);
			break;
		case 'newest':
			$mods = $rep->getByNewest($src_tags);
			break;
		case 'name':
			$mods = $rep->getByName($src_tags);
			break;

		}
		return $this->render(
						'RSHubMarketplaceBundle:Marketplace:index.html.twig',
						array('categories' => $tag_list, 'mods' => $mods,
								'tag' => $tag, 'tagname' => ($tag == 'all') ? 'all' : $tag -> getName()));
	}
	public function viewAction(Modification $m) {
		return $this->render(
						'RSHubMarketplaceBundle:Marketplace:view.html.twig',
						array('mod' => $m));
	}
	public function addAction() {
		$mod = new Modification();
		$form = $this->createForm(new ModificationType(), $mod);
		$request = $this->get('request');
		if ($request->getMethod() == 'POST') {
			$form->bind($request);

			if ($form->isValid()) {
				$em = $this->getDoctrine()
						->getManager();
				$em->persist($mod);
				$em->flush();

				return $this->redirect(
								$this->generateUrl(
												'rs_hub_marketplace_homepage'));
			}
		}

		return $this->render(
						'RSHubMarketplaceBundle:Marketplace:add.html.twig',
						array('form' => $form->createView(),));

	}
}
