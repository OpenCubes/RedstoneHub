<?php

// src/Sdz/BlogBundle/Controller/BlogController.php
namespace RSHub\MarketplaceBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use RSHub\MarketplaceBundle\Entity\Modification;

class MarketplaceController extends Controller {
	public function indexAction() {
		$mod = new Modification();
		$mod->setName('TooManyItems')
				->setIcon(
						'http://www.minecraftforum.net/uploads/profile/photo-1727786.png?_r=1351513511')
				->setSummary('Tired ? me too');

		return $this->render(
						'RSHubMarketplaceBundle:Marketplace:index.html.twig',
						array('categories' => array(),
								'mods' => array($mod, $mod)));
	}
	public function addAction() {
		$mod = new Modification();
		$form = $this->createFormBuilder(Modification(), $mod);
		$request = $this->get('request');
		if ($request->getMethod() == 'POST') {
			$form->bind($request);

			if ($form->isValid()) {
				$em = $this->getDoctrine()
						->getManager();
				$em->persist($mod);
				$em->flush();

				return $this->redirect($this->generateUrl(''));
			}
		}

		return $this->render('RSHub:MarketplaceBundle:add.html.twig',
						array('form' => $form->createView(),));

	}
}
