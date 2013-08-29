<?php

// src/Sdz/BlogBundle/Controller/BlogController.php
namespace RSHub\MarketplaceBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RSHub\MarketplaceBundle\Entity\Modification;
use RSHub\MarketplaceBundle\Form\ModificationType;

class MarketplaceController extends Controller {
	public function indexAction() {
		return $this->render(
						'RSHubMarketplaceBundle:Marketplace:index.html.twig',
						array('categories' => array(),
								'mods' => $this->getDoctrine()
										->getRepository(
												'RSHubMarketplaceBundle:Modification')
										->findAll()));
	}
	public function viewAction(Modification mod){
		return $this->render(
				'RSHubMarketplaceBundle:Marketplace:view.html.twig', array('mod', $mod));
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
